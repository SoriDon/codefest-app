import Vue from "vue";
import Router from "vue-router";
import store from "@store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      name: "~",
      path: "/",
      component: () => import(`@pages/Home`),
      meta: {
        title: "CodeFest '19 | IIT (BHU) Varanasi",
        metaTags: [],
        noTerminal: false,
        requiresAuth: true
      }
    },
    {
      name: "~/events",
      path: "/events",
      component: () => import(`@pages/EventList`),
      meta: {
        title: "CodeFest '19 | Events",
        metaTags: [],
        noTerminal: false
      }
    },
    {
      name: "~/events/name",
      path: "/events/:name",
      component: () => import("@pages/EventDetails"),
      meta: {
        title: "CodeFest '19 | Event",
        metaTags: [],
        noTerminal: false
      }
    },
    {
      name: "~/login",
      path: "/login",
      component: () => import(`@pages/Login`),
      meta: {
        title: "CodeFest '19 | Login",
        metaTags: [],
        noTerminal: false
      }
    },
    {
      name: "~/dashboard",
      path: "/dashboard",
      component: () => import(`@pages/Dashboard`),
      props: {
        isHomeView: true
      },
      meta: {
        title: "CodeFest '19 | Dashboard",
        metaTags: [],
        noTerminal: true,
        requiresAuth: true
      }
    },
    {
      name: "~/dashboard/events",
      path: "/dashboard/events",
      component: () => import(`@pages/Dashboard`),
      props: {
        isEventsView: true
      },
      meta: {
        title: "CodeFest '19 | Event Registration",
        metaTags: [],
        noTerminal: true,
        requiresAuth: true
      }
    },
    {
      name: "~/haxplore",
      path: "/haxplore",
      component: () => import(`@pages/Hacksplore`),
      meta: {
        title: "CodeFest '19 | HaXplore",
        metaTags: [],
        noTerminal: true
      }
    },
    {
      name: "~/test",
      path: "/dummy",
      component: () => import("@pages/Test")
    },
    {
      name: "404",
      path: "/*",
      component: () => import(`@pages/404`),
      meta: {
        title: "CodeFest '19 | 404",
        noTerminal: false
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    else
      return {
        x: 0,
        y: 0
      };
  }
});

// Credits to: https://alligator.io/vuejs/vue-router-modify-head
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    el => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  // Handle secure routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) return next();
    return next({
      name: "~/login",
      query: { redirect: to.fullPath }
    });
  }

  next();
});

export default router;
