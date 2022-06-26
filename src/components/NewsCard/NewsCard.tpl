<article class="news-card" data-page="{{ page }}" data-index="{{ index }}">
  <figure class="news-card__paper">
    <img class="news-card__thumbnail" src="{{ urlToImage }}" alt="thumbnail" />
    <figcaption class="news-card__content">
      <h2 class="news-card__title" title="{{ title }}">
        {{ title }}
      </h2>
      <p class="news-card__description">{{ description }}</p>
      <div class="news-card__info">
        <div class="news-card__source" style="{{ hasSource }}">
          <span class="material-icons-outlined icon">feed</span>
          <span class="text" title="{{ source }}">
            {{ source }}
          </span>
        </div>
        <div class="news-card__author" style="{{ hasAuthor }}">
          <span class="material-icons-outlined icon">edit</span>
          <span class="text" title="{{ author }}">
            {{ author }}
          </span>
        </div>
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
