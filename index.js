var MyForm = {


	myForm : document.getElementById("myForm"),
	
	validate : function(){
		var isValid = true;
		var errors = []; 
		
		if (!validMail(this.myForm.email)){

			errors.push(this.myForm.email.name);
			isValid = false;
		}
		
		if (!validFIO(this.myForm.fio)){
			errors.push(this.myForm.fio.name);
			isValid = false;
		}
		
		if (!validNumber(this.myForm.phone)){
			errors.push(this.myForm.phone.name);
			isValid = false;
		}
		
		return {isValid : isValid, errorFields: errors};
	
	},

	submit : function () {
        this.myForm.email.classList.remove("error");
        this.myForm.fio.classList.remove("error");
        this.myForm.phone.classList.remove("error");


        var valid = this.validate();
        if (!valid.isValid) {

            valid.errorFields.forEach(function (t) {


                this.myForm.querySelector('input[name="' + t + '"').classList.add("error");
            }, this)
        }
        var postData = new FormData(this.myForm);
        var btn = document.getElementById("submitButton");
        btn.disabled = true;


        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();
        xhr.open('POST', this.myForm.action, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                alert('ошибка,' + (this.status ? this.statusText : 'не удалось выполнить запрос'));
                return;
            }

            var responseServer = JSON.parse(xhr.responseText);
            var resContainer = document.getElementById("resultContainer");
            resContainer.classList.remove("success", "progress", "error");
            if (responseServer.status === "progress") {
                resContainer.classList.add(responseServer.status);
                resContainter.innerHTML = "Progress";
                setTimeout(function () {
                    xhr.open('POST', MyForm.myForm.action, true);
                    xhr.send(postData);
                }, responseServer.timeout, postData);
            }
            else if (responseServer.status === "success") {
                resContainer.classList.add(responseServer.status);
                resContainer.innerHTML = "Success";

            }
            else if (responseServer.status === "error") {
                resContainer.classList.add(responseServer.status);
                resContainer.innerHTML = responseServer.reason;
            }

        };
        xhr.send(postData);
    }

	
};

function validMail(myMail) {
    var validEmail = true;
    var mailRegular = /^\w+@(?:ya\.ru|yandex\.(?:ru|ua|by|kz|com))$/;
    var valid = mailRegular.test(myMail.value);
    return valid;
}

function validFIO(myFIO)
{
	var validfio = true;//ну крч, там ничего толкового
	var fioRegular = /^[а-яА-ЯёЁa-zA-Z]+\s+[а-яА-ЯёЁa-zA-Z]+\s+[а-яА-ЯёЁa-zA-Z]+$/;
	var valid = fioRegular.test(myFIO.value);//не помню, что test делает)
	return valid;
}

function validNumber(mynumber)
{
	var validnumber = true;
	var mynamberval = mynumber.value;
	var phoneRegular = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
	var valid = phoneRegular.test(mynamberval);
	var sum = 0;
	for (var i = 0; i < mynamberval.length; i++){
		if ( isFinite(mynamberval[i])){	
			sum += +mynamberval[i];
		}
	}
	

	if(valid)
	{
		if (sum >30) return false;
	}
	else return false;
	
	return true;
}
function getData()
{
	return
	{
		fio: this.myForm.fio.value
		email: this.myForm.email.value
		phone: this.myForm.phone.value


	}
}
function setData() {
    var nameArray = ["fio", "email", "phone"];

    nameArray.forEach(function (name, i, array) {
        if (name in (Object)) {
            this[name].value = Object[name];
        }
    }, this);
}
document.addEventListener("submit", function(event){
	event.preventDefault();

    MyForm.submit();
});

