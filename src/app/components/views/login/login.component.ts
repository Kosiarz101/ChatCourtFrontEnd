import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { AppUserService } from 'src/app/services/chatserver/app-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private appUserService: AppUserService) { 
    this.loginFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(4), this.IwaniukValidator()]]
    })
  }

  ngOnInit(): void { 
  }

  isUsernameValid() {
    return this.loginFormGroup.controls["username"].invalid;
  }

  public submit() {

    let username: string = this.loginFormGroup.controls['username'].value;
    this.appUserService.existsByEmail(username).subscribe(result =>
      {
        if(result) {
          this.loginFormGroup.controls['username'].setErrors({'incorrect': true})
        } else {
          this.handlePostUser(username);
        }
      }); 
  }

  private handlePostUser(username: string) {
    let user: AppUser = {
      username: username,
      email: '',
      password: '',
      messages: [],
      chatrooms: [],
      id: '',
      creationDate: new Date()
    }
    console.log(user);
    this.appUserService.add(user).subscribe(data => {
      console.log('data: ', data);
      console.log('data: ', data.status);
      if (data.status != 201) {
        console.log('ERROR');
      } else {
        this.router.navigate(['/chatroom']);
      }
    });
  }

  public getUsernameErrorMessage() {
    let username = this.loginFormGroup.controls["username"];
    if (username.hasError("required"))
      return "This field is required";
    else if (username.hasError("maxlength"))
      return "Max length is 24";
    else if (username.hasError("minlength"))
      return "Min length is 4"
    else if (username.hasError("forbiddenname"))
      return "You are too gay"
    return "Username has been already taken";
  }

  public IwaniukValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        return value.toLowerCase().includes("iwaniuk") ? {forbiddenname: {value: control.value}} : null;
    }
  }
}
