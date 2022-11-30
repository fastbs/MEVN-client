<template>
  <div class="container-fluid">
    <div class="row m-3">
      <div class="mb-3"><h1>Home</h1></div>
      <div class="col-12 col-sm-6 col-lg-4" v-for="card in cards" :key="card.id">
        <div class="card mb-3 shadow">
          <img
            :src="card.image"
            class="card-img-top"
            style="object-fit: cover"
            height="200"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text text-truncate">{{ card.text }}</p>
            <button type="button" class="btn btn-primary me-2">Primary</button>
            <!--           <button type="button" class="btn btn-secondary me-2">Secondary</button>
          <button type="button" class="btn btn-success me-2">Success</button>
          <button type="button" class="btn btn-info me-2">Info</button>
          <button type="button" class="btn btn-warning me-2">Warning</button>
          <button type="button" class="btn btn-danger me-2">Danger</button>
          <button type="button" class="btn btn-light me-2">Light</button>
          <button type="button" class="btn btn-dark me-2">Dark</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          id: 1,
          title: "Первый заголовок",
          descr: "Первый подзаголовок",
          text: "Над седой равниной моря ветер тучи собирает. Между тучами и морем гордо реет Буревестник, черной молнии подобный. То крылом волны касаясь, то стрелой взмывая к тучам, он кричит, и — тучи слышат радость в смелом крике птицы. В этом крике — жажда бури!",
          image: "/images/zai.jpg",
        },
        {
          id: 2,
          title: "Второй заголовок",
          descr: "Второй подзаголовок",
          text: "текст",
          image: "/images/volk.jpg",
        },
        {
          id: 3,
          title: "Третий заголовок",
          descr: "Третий подзаголовок",
          text: "текст",
          image: "/images/index.jpg",
        },
      ],
    };
  },
};
</script>

