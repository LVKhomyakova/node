require('@babel/register')({ 
    ignore: [/(node_modules)/], 
    presets: [
      ['@babel/preset-env',
        { 
          "targets": { 
            "node": "14.17",  
          } 
        }    
      ]
    ] 
});
  
require('./service4595');