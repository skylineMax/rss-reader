import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, IonicPage } from 'ionic-angular';
import { FeedService, Feed } from '../../providers/feed-service/feed-service';
 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
 
  rootPage = 'FeedListPage';
  feeds: Feed[];
  feedsCount: Number;
 
  constructor(
    private feedService: FeedService, 
    public alertCtrl: AlertController
  ) {  }
 
  public addFeed() {
    let wrongNameAlert = this.alertCtrl.create({
      subTitle: 'Type your feed name, please.',
      buttons: ['Ok']
    });

    let wrongUrlAlert = this.alertCtrl.create({
      subTitle: 'Type your feed url, please.',
      buttons: ['Ok']
    });

    let promptAlert = this.alertCtrl.create({
      title: 'Add Feed URL',
      inputs: [
        {
          name: 'name',
          placeholder: 'The Feed name'
        },
        {
          name: 'url',
          placeholder: 'http://www.feedurl.com/'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: data => {
            if(!data.name ) {
              wrongNameAlert.present();
            } else if(!data.url) {
              wrongUrlAlert.present();
            } else {
              let newFeed = new Feed(data.name, data.url);
              this.feedService.addFeed(newFeed).then(
                res => {
                  this.loadFeeds();
                }
            );
            } 
          }
        }
      ]
    });
    promptAlert.present();
  }

  public deleteFeed(index: number) {
    this.feedService.deleteFeed(index).then(res => {
      this.loadFeeds();
    });
  }
  
  private loadFeeds() {
    this.feedService.getSavedFeeds().then(
      allFeeds => {
        this.feeds = allFeeds;
        this.feedsCount = this.feeds.length;
        //return this.feeds;
      });
  }
  
  public openFeed(feed: Feed) {
    this.nav.setRoot('FeedListPage', { 'selectedFeed': feed });
  }
 
  public ionViewWillEnter() {
    this.loadFeeds();
  }
}