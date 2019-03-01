import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitService } from 'src/app/services/visit.service';

@Component({
  selector: 'app-recent-visits',
  templateUrl: './recent-visits.component.html',
  styleUrls: ['./recent-visits.component.css']
})
export class RecentVisitsComponent implements OnInit {
  recentVisit: any = [ ];
  observation: {};
  visitStatus: String;
  recent: any = [ ];
  constructor(private route: ActivatedRoute,
    private service: VisitService) { }

  ngOnInit() {
    const patientUuid = this.route.snapshot.paramMap.get('id');
    this.service.recentVisits(patientUuid)
    .subscribe(response => {
      const visits = response.results;
      visits.forEach(visit => {
                this.service.fetchVisitDetails(visit.uuid)
                .subscribe(visitDetails => {
                      this.recentVisit.details = visitDetails;
                      const encounters = visitDetails.encounters;
                      encounters.forEach(encounter => {
                      const display = encounter.display;
                      if (display.match('ADULTINITIAL') !== null ) {
                      const obs = encounter.obs;
                      obs.forEach( res => {
                      const display1 = res.display;
                      if (display1.match('CURRENT COMPLAINT') !== null) {
                      const currentComplaint = display1.split('<b>');
                      var b = ' ';
                      for (let i = 1; i < currentComplaint.length; i++) {
                      const obs1 = currentComplaint[i].split('<');
                      var b = b + ' | ' + obs1[0];
                      this.recentVisit.observation = b;
                    }
                  }
                });
            }
          });
        if (visitDetails.stopDatetime == null || visitDetails.stopDatetime === undefined) {
          this.recentVisit.visitStatus = 'Active';
        }
        this.recent.push(this.recentVisit);
        });
      });
      });
  }
}
