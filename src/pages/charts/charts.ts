import { Component } from '@angular/core';
import { IonicPage, NavController,  ViewController, NavParams } from 'ionic-angular';
import { FeedService} from '../../providers/feed-service/feed-service';

/**
 * Generated class for the ChartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-charts',
  templateUrl: 'charts.html',
})
export class ChartsPage {
	//rootPage = 'FeedListPage';

	public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales'];
	public doughnutChartData:number[] = [35, 45];
	public doughnutChartType:string = 'pie';

	public chartClicked(e:any):void {
	  console.log(e);
	}

	public chartHovered(e:any):void {
	  console.log(e);
	}

  constructor(public navCtrl: NavController, 
				  public navParams: NavParams,
				  public viewCtrl: ViewController,
				  private feedService: FeedService ) {
  }

  close(e) {
  	this.viewCtrl.dismiss();
    console.log(e.path);
  }
   
}
