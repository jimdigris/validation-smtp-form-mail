'use strict';

(function () {
    const smtpForm = document.querySelector('.smtp-form');
    const mailForm = {
        name: smtpForm.querySelector('#name'),
        email: smtpForm.querySelector('#email'),
        phone: smtpForm.querySelector('#phone'),
        message: smtpForm.querySelector('#message'),
        notification: smtpForm.querySelector('#notification'),
        button: smtpForm.querySelector('#button'),
        resultText: smtpForm.querySelector('#result'),
        linkPage: smtpForm.querySelector('#link-page')
    };
    
    
    // ---
    
    
    mailForm.notification.addEventListener('click', onNotificationMailFormClick);
    mailForm.button.addEventListener('click', function (event){
        event.preventDefault();
        onButtonMailFormClick ();
    });
    
    
    // ---
    
    function getDataMailForm (){
        let data = {
            name: mailForm.name.value,
            email: mailForm.email.value,
            phone: mailForm.phone.value,
            message: mailForm.message.value
        };
        return data;
    }
    
    function executeValidationDataMailForm (data){
        const pattern = {
            name: /^[а-яёА-ЯЁA-Za-z\.\-\s]+$/,
            email: /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
            phone: /^[0-9\.\-\s\(\)\+]+$/,
            message: /^[а-яёА-ЯЁA-Za-z0-9_\.\,\-\s\(\)\+\!\?\:\;\"\'\*]+$/
        };
        let status = true;
        
        // обязательные поля
        if (data.name === ""){
            executeClassChangeResultTextMailForm('error');
            mailForm.resultText.innerHTML = 'Укажите ФИО!';
            status = false;
        }
        
        // валидация
        if (data.name != "" && pattern.name.test(data.name) === false){
            mailForm.resultText.innerHTML = 'Ошибка! Поле "ФИО" может содержать только: буквы, дефис и пробел.';
            status = false;            
        }
        if (data.email != "") {
            if (pattern.email.test(data.email) === false){
                executeClassChangeResultTextMailForm('error');
                mailForm.resultText.innerHTML = 'Ошибка! Поле "E-mail" содержит недопустимые символы или заполнено не корректно.';
                status = false;            
            }              
        }
        if (data.phone != "") {
            if (pattern.phone.test(data.phone) === false){
                executeClassChangeResultTextMailForm('error');
                mailForm.resultText.innerHTML = 'Ошибка! Поле "Телефон" содержит недопустимые символы.';
                status = false;            
            }              
        }
        if (data.message != "") {
            if (pattern.message.test(data.message) === false){
                executeClassChangeResultTextMailForm('error');
                mailForm.resultText.innerHTML = 'Ошибка! Поле "Сообщение" содержит недопустимые символы.';
                status = false;            
            }              
        }            
        
        return status;
    }
    
    function onNotificationMailFormClick (){
        mailForm.button.disabled = mailForm.notification.checked ? false : true;
    }
    
    function executeClassChangeResultTextMailForm (className){
        let baseClass = 'result';
        mailForm.resultText.className = '';
        mailForm.resultText.classList.add(baseClass); 
        mailForm.resultText.classList.add(className);   
    }
    
    function getLinkPage (){
        let linkPage = document.location.href;
        mailForm.linkPage.value = linkPage;
    }
    
    function onButtonMailFormClick (){ 
        let data = getDataMailForm ();
        let validationStatus = executeValidationDataMailForm (data);
        getLinkPage ();
        
        if (validationStatus){
            executeSendMailForm ();
            smtpForm.reset();
            onNotificationMailFormClick ();            
        }
    }
    
    function executeSendMailForm (){
        executeClassChangeResultTextMailForm('waiting');
        mailForm.resultText.innerHTML = 'Отправляем сообщение...';
        
        $.ajax({
            type: 'POST',
            url: 'phpmailer/send.php',
            data: $(smtpForm).serialize(),
            success: function (){
                executeClassChangeResultTextMailForm('successfully');
                mailForm.resultText.innerHTML = 'Сообщение отправлено.';
            },
            error: function (){
                executeClassChangeResultTextMailForm('error');
                mailForm.resultText.innerHTML = 'Ошибка отправки сообщения. Свяжитесь пожалуйста с нами другим способом.';
            },
            complete: function (){
            }
        });
    }
})();
