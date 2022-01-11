import { createReducer } from "reduxsauce";

export const initialState = {
  profile: null,
  basic_profile: null,
  uid: "",
  invitation: null,
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null,
  redirect_token: null,
  posts: [],
  users: [],
  screen: "personal",
  reset: false,
};

const saveOnboardingReducer = (state, action) => ({
  ...state,
  basic: action.basic,
});

const saveProfileReducer = (state, action) => ({
  ...state,
  profile: action.profile,
});

const saveBrandReducer = (state, action) => ({
  ...state,
  brand: action.brand,
});

const saveUIDReducer = (state, action) => ({
  ...state,
  uid: action.uid,
});

const saveInvitationReducer = (state, action) => ({
  ...state,
  invitation: action.invitation,
});

const savePetReducer = (state, action) => ({
  ...state,
  pet: action.pet,
});

const saveBikeReducer = (state, action) => ({
  ...state,
  bike: action.bike,
});

const saveHealthReducer = (state, action) => ({
  ...state,
  health: action.health,
});

const saveHomeReducer = (state, action) => ({
  ...state,
  home: action.home,
});

const saveRentReducer = (state, action) => ({
  ...state,
  rent: action.rent,
});

const saveRedirectTokenReducer = (state, action) => ({
  ...state,
  redirect_token: action.redirect_token,
});

const resetConciergeReducer = (state, action) => ({
  ...state,
  reset: action.reset,
});

const removeAllReducer = (state, action) => ({
  ...state,
  invitation: null,
  profile: null,
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null,
});
const saveComingflagReducer = (state, action) => ({
  ...state,
  coming_flag: action.coming_flag,
});
const savePostsReducer = (state, action) => ({
  ...state,
  posts: action.posts,
});
const saveUsersReducer = (state, action) => ({
  ...state,
  users: action.users,
});
const saveScreenReducer = (state, action) => ({
  ...state,
  screen: action.screen,
});
const saveWalletScreenReducer = (state, action) => ({
  ...state,
  wallet_screen: action.wallet_screen,
});
const saveExploreScreenReducer = (state, action) => ({
  ...state,
  explore_screen: action.explore_screen,
});
const actionHandlers = {
  SAVE_ONBOARDING: saveOnboardingReducer,
  SAVE_PROFILE: saveProfileReducer,
  SAVE_BRAND: saveBrandReducer,
  SAVE_UID: saveUIDReducer,
  SAVE_INVITATION: saveInvitationReducer,
  SAVE_PET: savePetReducer,
  SAVE_BIKE: saveBikeReducer,
  SAVE_HEALTH: saveHealthReducer,
  SAVE_HOME: saveHomeReducer,
  SAVE_RENT: saveRentReducer,
  SAVE_REDIRECT_TOKEN: saveRedirectTokenReducer,
  REMOVE_ALL: removeAllReducer,
  SAVE_COMINGFLAG: saveComingflagReducer,
  SAVE_POST: savePostsReducer,
  SAVE_ALLUSER: saveUsersReducer,
  SAVE_SCREEN: saveScreenReducer,
  RESET_CONCIERGE: resetConciergeReducer,
  WALLET_SCREEN: saveWalletScreenReducer,
  EXPLORE_SCREEN: saveExploreScreenReducer,
};
export default createReducer(initialState, actionHandlers);
