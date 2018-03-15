Rails.application.routes.draw do
  root to: 'home#index'
  get '/osers/all', to: 'home#osers'
  get '/comments/all', to: 'home#comments'

  get '/comments/:id/children', to: 'comments#children'

  get '/osers/:id/comments', to: 'osers#comments'
  get '/osers/search', to: 'osers#search'
  get '/signup', to: 'osers#signup'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :comments
  resources :osers
end
