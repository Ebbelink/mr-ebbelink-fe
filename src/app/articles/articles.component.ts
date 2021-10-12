import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { ARTICLES_FOR_TAG_QUERY, ARTICLES_QUERY } from "../apollo/queries/articles";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-articles",
  templateUrl: "./articles.component.html",
  styleUrls: ["./articles.component.scss"]
})
export class ArticlesComponent implements OnInit {
  data: any = {};
  loading = true;
  errors: any;
  articles: any[] = [];
  articlesLeft: any[] = [];
  articlesRight: any[] = [];

  private graphQlQuerySubscription: Subscription | undefined = undefined;

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      input => {
        let tags = input.semicolonSeperatedCategories?.split("~") ?? [];

        this.articles = [];
        this.articlesLeft = [];
        this.articlesRight = [];

        this.retrieveArticles(tags);
      });
  }

  private retrieveArticles(tags: string[]) {
    this.loading = true;
    this.errors = null;

    this.graphQlQuerySubscription = this.apollo
      .watchQuery({
        query: ARTICLES_FOR_TAG_QUERY,
        variables: {
          categories: tags
        }
      })
      .valueChanges.subscribe(result => {
        this.data = result.data;
        this.articles = this.data.articles;

        for (let i = 0; i < this.articles.length; i++) {
          if (i % 2 === 0) {
            this.articlesLeft?.push(this.articles?.[i]);
          } else {
            this.articlesRight?.push(this.articles?.[i]);
          }
        }

        this.loading = result.loading;
        this.errors = result.errors;
      });
  }

  ngOnDestroy() {
    this.graphQlQuerySubscription?.unsubscribe();
  }
}
