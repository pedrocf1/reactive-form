import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, ControlContainer } from '@angular/forms';
import { flatMap } from "rxjs/operators";
import { Customer } from './customer';

function ratingRange(min:number, max:number): ValidatorFn{
  return (c: AbstractControl): {[key: string]: boolean} | null =>{
    if (c.value !== null && (isNaN(c.value) || c.value<min || c.value>max)) {
      return {'range':true}
    }
    return null
  }
}
function emailMatcher(c:AbstractControl): {[key:string]:boolean}|null{
    const emailControl = c.get('email')
    const confirmControl = c.get('confirmEmail')

    if(emailControl.pristine || confirmControl.pristine){
      return null
    }

    if(emailControl.value === confirmControl.value){
      return null
    }
    return {'match':true}
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['adasdsa', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
      emailGroup:this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail:['']
      },{validator: emailMatcher}),
      phone:['',[Validators.required]],
      notification:['email'],
      sendCatalog: [true],
      rating:[null, ratingRange(1,5)]
    })
    setTimeout(() => {
      this.populateTestData()
    }, 5000);
    this.customerForm.get('notification').valueChanges.subscribe(value=>this.setNotification(value))
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  populateTestData(){
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      sendCatalog:false
    })
  }

  setNotification(notifyVia: string): void{
    console.log('entrei no metodo e tals')
    const phoneControl = this.customerForm.get('phone')
    if (notifyVia == 'text') {
      phoneControl.setValidators(Validators.required)
    } else {
      phoneControl.clearValidators()
    }
    phoneControl.updateValueAndValidity()
  }

}
