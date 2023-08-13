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
  public hidePassword: boolean = true;
  public isLogin: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private appUserService: AppUserService) { 
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(4), Validators.email, appUserService.isUserIwaniuk()]],
      username: ['', [Validators.maxLength(24), Validators.minLength(4), appUserService.isUserIwaniuk()]],
      password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6), this.passwordValidator()]]
    })
  }

  ngOnInit(): void { 
  }

  isEmailValid() {
    return this.loginFormGroup.controls["email"].invalid;
  }

  isUsernameValid() {
    return this.loginFormGroup.controls["username"].invalid;
  }

  isPasswordValid() {
    return this.loginFormGroup.controls["password"].invalid;
  }

  setIsLogin(value: any) { this.isLogin = value; }

  public submit() {

    if (this.isLogin)
      this.handleLogin();
    else 
      this.handleRegister(); 
  }

  private handleRegister() {
    let user: AppUser = this.createUser();
    this.appUserService.existsByEmail(user.email).subscribe(result =>
      {
        if(result) {
          this.loginFormGroup.controls['email'].setErrors({'incorrect': true})
        } else {
          this.handlePostUser(user);
        }
      }); 
  }

  private handleLogin() {
    let email: string = this.loginFormGroup.controls['email'].value;
    let password: string = this.loginFormGroup.controls['password'].value;
    this.appUserService.login(email, password).subscribe(result => {
      console.log('login result: ', result);
      if(result.status == 200)
        this.router.navigate(['/chatroom']);
      else
        this.loginFormGroup.controls['email'].setErrors({'badCredentials': true});
    });
  }

  private createUser(): AppUser {
    let email: string = this.loginFormGroup.controls['email'].value;
    let username: string = this.loginFormGroup.controls['username'].value;
    let password: string = this.loginFormGroup.controls['password'].value;
    let user: AppUser = {
      username: username,
      email: email,
      password: password,
      messages: [],
      chatrooms: [],
      id: '',
      creationDate: new Date()
    }
    return user;
  }

  private handlePostUser(user: AppUser) {
    console.log(user);
    this.appUserService.add(user).subscribe(data => {
      if (data.status != 201) {
        this.loginFormGroup.controls['email'].setErrors({'incorrect': true})
      } else {
        this.router.navigate(['/chatroom']);
      }
    });
  }

  public passwordValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value: string = control.value;
        if (value.toLocaleLowerCase() == value)
          return {upperLetter: {value: control.value}};
        else if (value.toUpperCase() == value)
          return {lowerLetter: {value: control.value}};
        else if (!(/\d/.test(value)))
          return {number: {value: control.value}};
        return null;
    }
  }

  public getFieldErrorMessage(name: string) {
    let field = this.loginFormGroup.controls[name];
    if (field.hasError("required"))
      return "This field is required";
    else if (field.hasError("maxlength"))
      return "Max length is 24";
    else if (field.hasError("minlength"))
      return "Min length is 4"
    else if (field.hasError("email"))
      return "Provide real email"
    else if (field.hasError("lowerLetter"))
      return name + " must contain minimum one lower letter"
    else if (field.hasError("upperLetter"))
      return name + " must contain minimum one upper letter"
    else if (field.hasError("number"))
      return name + " must contain minimum one number"
    else if (field.hasError("forbiddenName"))
      return "you are too gay"
    else if (field.hasError("incorrect"))
      return name + " has been already taken"
    return "unknown error";
  }
}
