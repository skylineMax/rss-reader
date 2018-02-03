import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

 
export class FeedItem {
  description: string;
  link: string;
  title: string;
  author: string;
 
  constructor(title: string, link: string, description: string, author: string) {
    this.title = title;
    this.link = link;
    this.description = description;
    this.author = author;
  }
}
 
export class Feed {
  title: string;
  url: string;
 
  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}
 
@Injectable()
export class FeedService {
 
  constructor(private http: Http, public storage: Storage) {}
 
  public getSavedFeeds() {
    return this.storage.get('savedFeeds').then(data => {
      if (data !== null && data !== undefined) {
        return JSON.parse(data);
      } else {
        console.log('wrong response');
        return [];
      }
    });
  }
 
	public addFeed(newFeed: Feed) {
		return this.getSavedFeeds().then(arrayOfFeeds => {
			arrayOfFeeds.push(newFeed);
			let jsonString = JSON.stringify(arrayOfFeeds);
			return this.storage.set('savedFeeds', jsonString);
		});
	}

	public deleteFeed(index: number) {
    
		return this.getSavedFeeds().then(arrayOfFeeds => {
      arrayOfFeeds.splice(index, 1);
      let jsonString = JSON.stringify(arrayOfFeeds);
      return this.storage.set('savedFeeds', jsonString);
		});
	}
  public rssArticlesPushing(res: Object, articles: any[]) {
    let objects = res['item'];
 
      for (let i = 0; i < objects.length; i++) {
        let item = objects[i];
        let author = item.hasOwnProperty('author') ? item.author : item.creator;
        let newFeedItem = new FeedItem(
          item.title, 
          item.link, 
          item.description,
          author
        );
        articles.push(newFeedItem);
      }
  }

  public atomArticlesPushing(res: Object, articles: any[], contentData: any[]) {
    let objects = res['entry'];
 
      for (let i = 0; i < objects.length; i++) {
        let entry = objects[i];
        let link;
        let linkTag = entry.link;

        if (Array.isArray(linkTag)){
          link = linkTag[0].href;
        } else {
          link = linkTag['href'];
        }
        if(entry.summary.content === undefined) {
          entry.summary.content = 'There is no description.'
        }
        if(entry.content.content){
          contentData.push(this.getFrequency(entry.content.content));
        }
        
        console.log(contentData);
        let newFeedItem = new FeedItem(
          entry.title.content, 
          link, 
          entry.summary.content,
          entry.author.name
        );
        articles.push(newFeedItem);
      }
  }
 
  public getFrequency(content: string) {
    let lowcase = content.toLowerCase();
      let prepros = lowcase.replace(/[^a-z]/g, "");

        let freq = {};
        for (let i=0; i<prepros.length;i++) {
            let character = prepros.charAt(i);
            if (freq[character]) {
               freq[character]++;
            } else {
               freq[character] = 1;
            }
        }
    return freq;
  }

  public getArticlesForUrl(feedUrl: string, feedType: string) {
    let url = 'https://query.yahooapis.com/v1/public/yql?q=select%20%2A%20from%20'+feedType+'%20where%20url%3D%22'+encodeURIComponent(feedUrl)+'%22&format=json';
    let articles = [];
    let contentData = [];
    return this.http.get(url)
    .map(data => data.json()['query']['results'])
    .map((res) => {
      console.log(res);
      if (res == null) {
        return res;
      }
      if (feedType === 'rss') {
        this.rssArticlesPushing(res, articles);
      } else if(feedType === 'atom') {
        this.atomArticlesPushing(res, articles, contentData);
      }
      console.log(articles);
      console.log(contentData);
      return articles;
    });
  }
}