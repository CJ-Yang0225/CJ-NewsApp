<article class="news-card">
  <figure class="news-card__paper">
    <img class="news-card__thumbnail" src="{{ urlToImage }}" alt="thumbnail" />
    <figcaption class="news-card__body">
      <h1 class="news-card__title">
        {{ title }}
      </h1>
      <div class="news-card__info">
        <span class="news-card__source">
          {{ source }}
        </span>
        <span class="news-card__author">
          {{ author }}
        </span>
      </div>
      <span class="news-card__published-at">
        {{ publishedAt }}
      </span>
      <span class="material-icons-outlined news-card__bookmark">
        {{ isCollected }}
      </span>
    </figcaption>
  </figure>
</article>
