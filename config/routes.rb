Rails.application.routes.draw do
  root to: 'home#index'
  get '/osers/all', to: 'home#osers'
  get '/comments/all', to: 'home#comments'

  get '/comments/:id/children', to: 'comments#children'
  get '/signup', to: 'home#signup'

  resources :comments
  resources :osers
end
