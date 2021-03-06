import { none } from '@ushiboy/cyclone';

export function createAdapter(store) {
  return router => {
    router.listen((href, args, query, match) => {
      store.dispatch(changeRoute(href, args, query, match));
    });

    return action => {
      if (action instanceof Promise) {
        return action.then(result => {
          if (result != null) {
            store.dispatch(result);
          }
        });
      } else {
        throw new Error('action should return Promise.');
      }
    };
  };
}

export const TRIDORON_CHANGE_ROUTE = '$$tridoron$$/CHANGE_ROUTE';

export function changeRoute(href, args, query, match) {
  return {
    type: TRIDORON_CHANGE_ROUTE,
    payload: {
      href,
      args,
      query,
      match
    }
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TRIDORON_CHANGE_ROUTE: {
      const { href, args, query, match } = action.payload;
      return [
        Object.assign({}, state, {
          href,
          args,
          query,
          match
        }),
        none()
      ];
    }
    default:
      return [state, none()];
  }
}

export function initializeRouteReducerState(router) {
  const r = router.getCurrentRoute();
  const href = router.getCurrentHref();
  if (r) {
    const { args, query } = r;
    return {
      href,
      args,
      query,
      match: true
    };
  }
  return {
    href,
    args: [],
    query: {},
    match: false
  };
}
