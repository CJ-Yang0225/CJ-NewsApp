<header class="header">
  <a
    class=" icon-link"
    href="{{ backUrl }}"
    style="display: {{ showBackIcon }};"
  >
    <span class="material-icons header__back-icon">arrow_back</span>
  </a>
  <div class="header__logo-wrapper">
    <a class="icon-link" href="./index.html">
      <span class="material-icons header__logo-icon" style="display: {{ showLogoIcon }};">
        logo_dev
      </span>
    </a>
    <h1 class="header__title">{{ title }}</h1>
  </div>
  <a
    class="icon-link"
    href="./collections.html"
    style="display: {{ showCollectionIcon }};"
  >
    <span class="material-icons">collections_bookmark</span>
  </a>
  {{ tpl }}
</header>
