import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  username: string = '';
  password: string = '';
  secquestion: string = '';
  answer: string = '';
  userData: any[] = [];
  fieldsEmpty: string = '';
  showPassword: boolean = false;

  securityQuestions: string[] = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What is your favorite movie?",
    "What city were you born in?",
    "What is the name of your elementary school?"
  ];

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username || this.secquestion === "" || this.answer === "") {
      this.fieldsEmpty = "Please fill out all fields.";
      return;
    }
    this.idCheck(this.username);
  }

  isPasswordValid(password: string): boolean {
    // Password validation logic
    return true; // Placeholder return value
  }

  idCheck(username: string): void {
    this.http.get<any>('http://localhost:3005/api/students')
      .subscribe(
        (response) => {
          this.userData = response;
          const user = this.userData.find(user => user.email === username.toLowerCase());
          if (!user) {
            this.fieldsEmpty = "Unregistered Email Id";
            return;
          }
          if (this.secquestion !== "") {
            if (user.secquestion === this.secquestion) {
              if (user.secanswer === this.answer) {
                if (this.isPasswordValid(this.password)) {
                  const dataObj = {
                    email: username,
                    password: this.password
                  };
                  this.http.put('http://localhost:3005/api/students/reset', dataObj)
                    .subscribe(() => {
                      alert("Password Updated successful");
                      this.router.navigate(['/']);
                    });
                } else {
                  this.fieldsEmpty = "Invalid Password";
                }
              } else {
                this.fieldsEmpty = "Incorrect Answer";
              }
            } else {
              this.fieldsEmpty = "Please Select Correct Question !!";
            }
          } else {
            this.fieldsEmpty = "Please Select a Question ";
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }
}
