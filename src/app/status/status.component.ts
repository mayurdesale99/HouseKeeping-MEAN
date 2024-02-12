import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit {

  @Input() userEmail!: string; // Note the ! operator for initialization

  requests: any[] = [];
  currentPage: number = 1;
  recordsPerPage: number = 4;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.http.get<any[]>('http://localhost:3005/api/students').subscribe(userData => {
      const user = userData.find(user => user.email === this.userEmail);
      const id = user.stdid;
      this.http.get<any[]>('http://localhost:3005/api/requests').subscribe(response => {
        this.requests = response.filter(item => item.stdid === id);
      }, error => {
        console.error('Error fetching requests:', error);
      });
    }, error => {
      console.error('Error fetching user data:', error);
    });
  }

  get currentRecords(): any[] {
    const indexOfLastRecord = this.currentPage * this.recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - this.recordsPerPage;
    return this.requests.slice(indexOfFirstRecord, indexOfLastRecord);
  }

  handlePageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  get totalPages(): number {
    return Math.ceil(this.requests.length / this.recordsPerPage);
  }

  // Corrected method name
  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

}
