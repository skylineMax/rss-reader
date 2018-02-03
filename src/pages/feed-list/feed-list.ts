import { Component } from '@angular/core';
import { 
  AlertController,
  PopoverController, 
  ViewController,
  NavController, 
  NavParams, 
  IonicPage 
} from 'ionic-angular';
import { ChartsPage } from '../charts/charts';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FeedService, FeedItem, Feed } from '../../providers/feed-service/feed-service';
 
@IonicPage({
  name: 'FeedListPage'
})
@Component({
  selector: 'page-feed-list',
  templateUrl: 'feed-list.html'
})
export class FeedListPage {
  articles: FeedItem[];
  selectedFeed: Feed;
  loading: Boolean;
  itemsCount: Number;
  popover: any;
 
  constructor(private nav: NavController, 
              private iab: InAppBrowser, 
              private feedService: FeedService, 
              private navParams: NavParams,
              public alertCtrl: AlertController,
              public popoverCtrl: PopoverController) {
    this.selectedFeed = navParams.get('selectedFeed');
    this.popover = this.popoverCtrl.create(ChartsPage);
  }
 
  public openArticle(url: string) {
    this.iab.create(url);
  }

  public presentChartStatictics(e: any) {
    this.popover.present();
    e.stopPropagation();

  }

  loadArticles() {
    this.loading = true;
    this.feedService.getArticlesForUrl(this.selectedFeed.url, 'rss').subscribe(res => {
      if(res === null) {
        this.feedService.getArticlesForUrl(this.selectedFeed.url, 'atom').subscribe(res => {
          this.articles = res;
          this.itemsCount = res.length;
          this.loading = false;
        });
      } else {
        this.articles = res;
        this.itemsCount = res.length;
        this.loading = false;
      }
      
    });
  }
 
  public ionViewWillEnter() {
    if (this.selectedFeed !== undefined && this.selectedFeed !== null ) {
      this.loadArticles();
    } else {
      this.feedService.getSavedFeeds().then(
        feeds => {
          if (feeds.length > 0) {
            let item = feeds[0];
            this.selectedFeed = new Feed(item.title, item.url);
            this.loadArticles();
          }
        }
      );
    }
  }
}
