import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  username: string = '';
  password: string = '';
  secquestion: string = '';
  answer: string = '';
  userData: any[] = [];
  fieldsEmpty: string = '';
  showPassword: boolean = false;
  error: string = '';

  securityQuestions: string[] = [
    "What is your mother's maiden name?",
    'What is the name of your first pet?',
    'What is your favorite movie?',
    'What city were you born in?',
    'What is the name of your elementary school?',
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<any[]>('http://localhost:3005/api/students').subscribe(
      (response) => {
        this.userData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username || !this.secquestion || !this.answer) {
      this.fieldsEmpty = 'Please fill out all fields.';
      return;
    }
    this.idCheck(this.username);
  }

  idCheck(username: string): void {
    const user = this.userData.find(
      (user) => user.email === username.toLowerCase()
    );
    if (!user) {
      this.fieldsEmpty = 'Unregistered Email Id';
      return;
    }
    if (this.secquestion !== '') {
      if (user.secquestion === this.secquestion) {
        if (user.secanswer === this.answer) {
          const isValidPassword = this.isPasswordValid(this.password);
          if (!isValidPassword.valid) {
            // this.fieldsEmpty = isValidPassword.error;
            return;
          } else {
            this.fieldsEmpty = '';
            const dataObj = {
              email: this.username,
              password: this.password,
            };
            this.http
              .put('http://localhost:3005/api/students/reset', dataObj)
              .subscribe(
                (resData) => {
                  alert('Password Updated successful');
                  this.router.navigate(['/']);
                },
                (error) => {
                  console.error('Error updating password:', error);
                  alert('Error updating password. Please try again later.');
                }
              );
          }
        } else {
          this.fieldsEmpty = 'Incorrect Answer';
        }
      } else {
        this.fieldsEmpty = 'Please Select Correct Question !!';
      }
    } else {
      this.fieldsEmpty = 'Please Select a Question ';
    }
  }

  isPasswordValid(password: string): { valid: boolean; error?: string } {
    if (password.length < 8) {
      return {
        valid: false,
        error: 'Password should contain at least 8 characters',
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        error: 'Password should contain at least 1 uppercase letter',
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        error: 'Password should contain at least 1 lowercase letter',
      };
    }
    if (!/\d/.test(password)) {
      return {
        valid: false,
        error: 'Password should contain at least 1 digit',
      };
    }
    if (!/[\W_]/.test(password)) {
      return {
        valid: false,
        error: 'Password should contain at least 1 special character',
      };
    }
    return { valid: true };
  }
}