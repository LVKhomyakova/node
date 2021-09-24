import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { of, Subscription } from "rxjs";
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/http.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  requestForm!: FormGroup;
  responseControl!: FormControl;
  selectedContentType!: string;
  pending: boolean = false;
  responseStatusOk!: boolean;
  responseStatusCode: string = '';
  responseHeaders: any[] = [];

  private _subscriptions: Subscription[] = [];

  constructor(private _fb: FormBuilder, private _httpService: HttpService) { }

  get params(): FormArray {
    return <FormArray>this.requestForm.get('params');
  }
  get headers(): FormArray {
    return <FormArray>this.requestForm.get('headers');
  }

  ngOnInit(): void {
    this.responseControl = new FormControl({value: '', disabled: true});
    this.requestForm = this._fb.group({
      method: ['GET', Validators.required],
      url: [null, Validators.required],
      params: this._fb.array([]),
      headers: this._fb.array([]),
      contentType: ['application/json', Validators.required],
      body: [{value: '', disabled: true}]
    });

    this._subscriptions.push(
      <Subscription>this.requestForm.get('method')?.valueChanges.subscribe((value) => {
        if (value === 'GET') {
          this.requestForm.controls.body?.disable();
          this.requestForm.controls.body?.clearValidators();
          
        } else {
          this.requestForm.controls.body?.enable();
          this.requestForm.controls.body?.setValidators(Validators.required);
          this.requestForm.controls.body?.updateValueAndValidity();

          this.responseHeaders = [];
          this.responseStatusCode = '';
          this.responseControl.reset();

          this.params.clear();
          this.headers.clear();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((item: Subscription) => item.unsubscribe());
  }

  clearFrom(): void {
    this.requestForm.reset();
    this.requestForm.controls.method.setValue('GET');
    this.requestForm.controls.contentType.setValue('application/json');
  }

  createRequest(): void {
    if (this.requestForm.invalid) return;
    this.pending = true;
    const method = this.requestForm.controls.method.value;
    const url = this.requestForm.controls.url.value;
    const queryParams: any = {};
    const headers: any = {
      'Content-Type': this.requestForm.controls.contentType.value
    };

    this.requestForm.controls.params.value.forEach((paramControl: any) => {
      queryParams[paramControl.key] = paramControl.value
    });
    this.requestForm.controls.headers.value.forEach((paramControl: any) => {
      headers[paramControl.key] = paramControl.value
    });
    const body = this.requestForm.controls.body.value;

    this._subscriptions.push(
      this._httpService.sendRequest(method, url, queryParams, headers, body).pipe(
        map((response) => {
          this.responseHeaders = [];
          this.responseStatusOk = response.statusOk;
          this.responseStatusCode = response.statusCode;

          Object.keys(response.headers).forEach(key => this.responseHeaders.push({key, value: response.headers[key]}));
          return response;
        }),
        catchError((err: any) => of({body: err}))
      ).subscribe((response: any) => {
        this.responseControl.setValue(response.body);
        this.pending = false;
      })
    )        
  }

  addParam(): void {
    const paramForm: FormGroup = this._fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required]
    });
  
    this.params.push(paramForm);
  }
  deleteParam(index: number): void { 
    this.params.removeAt(index);
  }

  addHeader(): void {
    const headerForm: FormGroup = this._fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required]
    });
  
    this.headers.push(headerForm);
  }
  deleteHeader(index: number): void { 
    this.headers.removeAt(index);
  }
}
