DEMO: [http://178.172.195.18:8180/service3095](http://178.172.195.18:8180/service3095)

Сделать систему голосования (приёма голосов).

На бэкенде:
- сервис /variants возвращает возможные варианты ответов (код ответа, текст ответа);
- сервис /stat возвращает статистику ответов (код ответа, количество принятых голосов);
- сервис /vote принимает ответ (код ответа).

На фронтенде:
- получить с бэкенда статистику ответов и варианты ответов;
- отобразить текущую статистику в любом виде;
- отобразить варианты ответов в виде кнопок;
- при нажатии на кнопку — отправить ответ, запросить и отобразить обновлённую статистику.

Серверная часть должна быть запущена на вашем учебном сервере.
Фронтенд-часть должна быть настроена на работу с вашим учебным сервером (а не с локально запускаемым сервером).

Прислать:
- URL репозитория и имя папки, где содержатся исходные коды и бэкенд- и фронтенд-части;
- URL в интернете, по которому открывается проект.
