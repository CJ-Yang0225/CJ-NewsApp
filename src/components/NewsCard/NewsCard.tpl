<article class="news-card" data-page="{{ page }}" data-index="{{ index }}">
  <div class="news-card__paper">
    <figure class="news-card__thumbnail-box">
      <img
        class="news-card__thumbnail"
        src="{{ urlToImage }}"
        alt=""
        loading="lazy"
      />
    </figure>
    <div class="news-card__content">
      <a href="{{ url }}" target="_blank" rel="noreferrer">
        <h2 class="news-card__title" title="{{ title }}">
          {{ title }}
        </h2>
      </a>
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
      {{ Bookmark }}
    </div>
  </div>
</article>
