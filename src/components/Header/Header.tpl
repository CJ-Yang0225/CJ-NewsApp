<header class="header__container">
  <div class="header__icon-wrapper" style="display: {{ showBackIcon }};">
    <a class="icon-link" href="{{ backUrl }}">
      <span class="material-icons">arrow_back</span>
    </a>
  </div>
  <div class="header__logo-wrapper">
    <a class="icon-link" href="./index.html">
      <span class="material-icons icon" style="display: {{ showLogoIcon }};">
        logo_dev
      </span>
    </a>
    <h1 class="header__title">{{ title }}</h1>
  </div>
  <div class="header__icon-wrapper">
    <a
      class="icon-link"
      href="./collections.html"
      style="visibility: {{ showCollectionIcon }};"
    >
      <span class="material-icons">collections_bookmark</span>
    </a>
  </div>
</header>
