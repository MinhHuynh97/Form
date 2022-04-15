// Doi tuong validator 
const $=document.querySelector.bind(document);

function Validator(option){
    function getParent(input,selector){
        while(input.parentElement)
        {
            if(input.parentElement.matches(selector))
                return input.parentElement;
            else{
                input=input.parentElement;
            }
        }
    }
    var selectRule={}
    function validate(InputElement,rule){
        var errorElement= getParent(InputElement,option.formGroupSelector).querySelector(option.errorSelector);
        var errorMess;
            
        var rules=selectRule[rule.selector];
        
        for (let i=0;i<rules.length;i++)
        {
            switch (InputElement.type) {
                case 'checkbox':
                    
                case 'radio':
                    errorMess=rules[i]
                    (formElement.querySelector(rule.selector+':checked'))
                    
                    break;
            
                default:
                    errorMess=rules[i](InputElement.value);
                    break;
            }
            
            if(errorMess)break;
        }
        if(errorMess)
        {
            errorElement.innerHTML=errorMess;
            getParent(InputElement,option.formGroupSelector).classList.add('invalid');
        }else{
            errorElement.innerHTML='';
            getParent(InputElement,option.formGroupSelector).classList.remove('invalid');
        }
        return !errorMess;
    }


    var formElement=document.querySelector(option.form);
    if(formElement)
    {
        // Xu ly khi submit
        
        formElement.onsubmit=function(e){
            var isValid=true;
            e.preventDefault();
            option.rules.forEach(rule => {
                var InputElement=formElement.querySelector(rule.selector);
                var Valid=validate(InputElement,rule);
                if(!Valid)
                {
                    isValid=Valid;
                }
                
            })
            

            // console.log(formValue)
            if(isValid)
            {
                if(typeof option.onSubmit==='function')
                {
                    var checkbox=[]
                    var enableInput=formElement.querySelectorAll('[name]:not([disable])');
                    var formValue=Array.from(enableInput).reduce(function(value,input){
                        switch (input.type) {
                            case 'checkbox':
                                // if(!input.matches('checked'))
                                // return value
                                if(checkbox.length==0){
                                    if(input.matches(':checked'))
                                        {
                                            checkbox=[input.value];
                                        }

                                    
                                }else{
                                    if(input.matches(':checked'))
                                        {
                                            checkbox.push(input.value);
                                        }
                                }
                                if(checkbox.length==0)
                                value[input.name]='';
                                else
                                value[input.name]=checkbox;
                                break;
                            case 'radio':
                                if(input.matches(':checked'))
                                    value[input.name]=input.value
                                
                                break;
                            case 'file':
                                value[input.name]=input.files;
                                break;
                            default:
                                value[input.name]=input.value
                                break;
                        }
                        
                        return  value;
                    },{});
                    option.onSubmit(formValue);
                }else{
                    formElement.onsubmit()
                }
            }
        }

        // Lap qua cac hanh dong blur, input
        option.rules.forEach(rule => {
            if(Array.isArray(selectRule[rule.selector]))
            {
                selectRule[rule.selector].push(rule.test)
            }else{
                selectRule[rule.selector]=[rule.test];
            }
            var InputElements=formElement.querySelectorAll(rule.selector);
            Array.from(InputElements).forEach(function(InputElement){
                InputElement.onblur=function()
                {
                    validate(InputElement,rule)
                    
                    
                }
                InputElement.oninput=function(){
                    var errorElement= getParent(InputElement,option.formGroupSelector).querySelector(option.errorSelector);
                    errorElement.innerHTML='';
                    getParent(InputElement,option.formGroupSelector).classList.remove('invalid');
                }
            })
            
            // console.log(element)
        });
        // console.log(selectRule)
    }
}

// Dinh nghia cac rule
// Quy dinh cua cac rule
// 1. Khi co loi tra ra message loi
// 2. Khong co loi tra ra undifined
Validator.isRequired=function(selector){
    return {
        selector:selector,
        test: function (value){
            return value?undefined:'Vui long nhap vao';
        }
    }
}

Validator.isEmail=function(selector){
    return {
        selector:selector,
        test: function (value){
            var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)?undefined:'Truong nay phai la email';
        }
    }
}

Validator.minLength=function(selector,length){
    return {
        selector:selector,
        test: function (value){
            return value.length>=length?undefined:`Nhap toi thieu ${length} ki tu`;
        }
    }
}

Validator.isConfirm=function(selector,confirm,mess)
{
    return {
        selector:selector,
        test:function(value){
            return value===confirm()?undefined:`${mess}`;
        }
    }
}