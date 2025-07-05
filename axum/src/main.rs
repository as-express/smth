use axum::{
    extract::Query,
    routing::get,
    Json, Router,
};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Deserialize)]
struct SearchParams {
    q: String,
}

#[derive(Serialize)]
struct Product {
    title: String,
    price: String,
    url: String,
    source: String, // olx / kaspi
}

async fn search_handler(Query(params): Query<SearchParams>) -> Json<Vec<Product>> {
    let keyword = params.q.clone();
    let (olx_products, kaspi_products) = tokio::join!(
        parse_olx(&keyword),
        parse_kaspi(&keyword)
    );

    let mut results = vec![];
    results.extend(olx_products);
    results.extend(kaspi_products);

    Json(results)
}

async fn parse_olx(keyword: &str) -> Vec<Product> {
    let url = format!(
        "https://www.olx.kz/list/q-{}/",
        urlencoding::encode(keyword)
    );

    let body = match reqwest::Client::new()
        .get(&url)
        .header("User-Agent", "Mozilla/5.0")
        .send()
        .await
        .and_then(|res| res.text())
    {
        Ok(text) => text,
        Err(_) => return vec![],
    };

    let document = Html::parse_document(&body);
    let card_selector = Selector::parse(".css-1sw7q4x").unwrap();
    let title_selector = Selector::parse("h6").unwrap();
    let price_selector = Selector::parse(".css-10b0gli").unwrap();
    let link_selector = Selector::parse("a").unwrap();

    let mut results = vec![];

    for element in document.select(&card_selector) {
        let title = element
            .select(&title_selector)
            .next()
            .map(|e| e.text().collect::<Vec<_>>().join(""))
            .unwrap_or_default();

        let price = element
            .select(&price_selector)
            .next()
            .map(|e| e.text().collect::<Vec<_>>().join(""))
            .unwrap_or_default();

        let link = element
            .select(&link_selector)
            .next()
            .and_then(|e| e.value().attr("href"))
            .unwrap_or("");

        if !title.is_empty() && !price.is_empty() {
            results.push(Product {
                title,
                price,
                url: format!("https://www.olx.kz{}", link),
                source: "olx".into(),
            });
        }
    }

    results
}

async fn parse_kaspi(keyword: &str) -> Vec<Product> {
    let url = format!(
        "https://kaspi.kz/shop/search/?text={}",
        urlencoding::encode(keyword)
    );

    let body = match reqwest::Client::new()
        .get(&url)
        .header("User-Agent", "Mozilla/5.0")
        .send()
        .await
        .and_then(|res| res.text())
    {
        Ok(text) => text,
        Err(_) => return vec![],
    };

    let document = Html::parse_document(&body);
    let card_selector = Selector::parse("div.item-card__info").unwrap();
    let title_selector = Selector::parse("a.item-card__name-link").unwrap();
    let price_selector = Selector::parse("span.item-card__prices-price").unwrap();

    let mut results = vec![];

    for element in document.select(&card_selector) {
        let title = element
            .select(&title_selector)
            .next()
            .map(|e| e.text().collect::<Vec<_>>().join("").trim().to_string())
            .unwrap_or_default();

        let link = element
            .select(&title_selector)
            .next()
            .and_then(|e| e.value().attr("href"))
            .unwrap_or("");

        let price = element
            .select(&price_selector)
            .next()
            .map(|e| e.text().collect::<Vec<_>>().join("").trim().to_string())
            .unwrap_or_default();

        if !title.is_empty() && !price.is_empty() && !link.is_empty() {
            results.push(Product {
                title,
                price,
                url: format!("https://kaspi.kz{}", link),
                source: "kaspi".into(),
            });
        }
    }

    results
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/search", get(search_handler));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));
    println!("✅ Rust parser running at http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
