import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {

  requests: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<any>('http://localhost:3005/api/requests')
      .subscribe(
        response => {
          const requestData = response;
          const requestsArray = Object.values(requestData);
          const flattenedRequests = requestsArray.flat();
          this.requests = flattenedRequests;
        },
        error => {
          console.error('Error fetching requests:', error);
        }
      );
  }

  allocateHousekeeperToRequest(reqid: any): void {
    this.http.get<any>('http://localhost:3005/api/staff')
      .subscribe(
        housekeepersData => {
          const inactiveHousekeeper = housekeepersData.find(
            (housekeeper: any) => housekeeper.status === 'inactive'
          );

          if (inactiveHousekeeper) {
            this.http.put(`http://localhost:3005/api/requests/admin/${reqid}`, {
              status: 'Allocated',
              hid: inactiveHousekeeper.hid,
            }).subscribe(() => {
              this.http.put(`http://localhost:3005/api/staff/allocate/${inactiveHousekeeper.hid}`, {
                reqid: reqid,
                status: 'Active',
              }).subscribe(() => {
                alert('Housekeeper allocated successfully');
                this.fetchData();
              });
            });
          } else {
            alert('No inactive housekeeper available for allocation');
          }
        },
        error => {
          console.error('Error allocating housekeeper to request:', error);
        }
      );
  }

  completeRequest(reqid: any): void {
    this.http.get<any>(`http://localhost:3005/api/requests/admin/${reqid}`)
      .subscribe(
        response => {
          const hid = response.hid;

          this.http.put(`http://localhost:3005/api/staff/complete/${hid}`, {
            status: 'inactive',
          }).subscribe(() => {
            alert('Request completed successfully');
            this.fetchData();
          });
        },
        error => {
          console.error('Error completing request:', error);
        }
      );
  }

}
