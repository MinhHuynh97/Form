function Validator(selector){
    var _this=this;
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
    var formRules={}
    // Quy uoc tao rule
    // Co loi thi return lai error
    // Khong co loi return undefined
    var validateRule={
        required:function(value){
            return value?undefined: 'Xin nhap truong nay';
        },
        email:function(value){
            var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)?undefined:'Truong nay phai la email';
        },
        min:function(min){
            return function(value){
                return value.length>=min?undefined: `Xin nhap toi thieu ${min} ki tu`;
            }
        },

    }
    var formElement=document.querySelector(selector);
    if(formElement){
        var inputElement=formElement.querySelectorAll('[name][rules]')
        Array.from(inputElement).forEach(function(element){
            var rules=element.getAttribute('rules').split('|');
            rules.forEach(function(rule){
                var valueValidate=validateRule[rule];
                var ruleInfo;
                if(rule.includes(':')){
                    ruleInfo=rule.split(':');
                    
                    valueValidate=validateRule[ruleInfo[0]](ruleInfo[1])
                }
                
                if(Array.isArray(formRules[element.name])){
                    formRules[element.name].push(valueValidate)
                }else{
                    formRules[element.name]=[valueValidate];
                }
                
                // console.log(rule)
            }
            )
            element.onblur=handleValidate;
            element.oninput=handleClearError;

            
        })
        
        function handleValidate(event){
           var ruleValid=formRules[event.target.name];
           var errorMessage;
           for(var rule of ruleValid){
               errorMessage=rule(event.target.value);
               if(errorMessage)break;
           }
        //    Hien thi error ra wesite
           if(errorMessage){
            var formGroup=getParent(event.target,'.form-group')
            if(formGroup)
            {
                formGroup.classList.add('invalid');
                var formMess=formGroup.querySelector('.form-message');
                formMess.innerText=errorMessage;
            }
           }
           return !errorMessage;
        // console.log(ruleValid())
        }
        // Xu ly clear cac mess loi
        function handleClearError(event){
            var formGroup=getParent(event.target,'.form-group');
            if(formGroup.classList.contains('invalid'))
            {
                formGroup.classList.remove('invalid');

            }
            var formMess=formGroup.querySelector('.form-message');
            if(formMess)
                formMess.innerText='';
        }
        console.log(this)
        // Xu ly submit form
        formElement.onsubmit=function(e){
            e.preventDefault();
            
            var isValid=true;
            var inputElement=formElement.querySelectorAll('[name][rules]')
            Array.from(inputElement).forEach(function(input){
                if(!handleValidate({target:input}))
                {
                    isValid=false
                }
            })
            if(isValid){
                if(typeof _this.onSubmit==='function')
                {
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
                    _this.onSubmit(formValue);
                }
                else{
                    formElement.submit();
                }
            }
        }
       
    }
}