Rails.application.routes.draw do
  root to: 'home#index'
  get '/osers/all', to: 'home#osers'
  get '/comments/all', to: 'home#comments'

  post '/upvotes', to: 'upvotes#create'
  delete '/upvotes', to: 'upvotes#destroy'
  post '/downvotes', to: 'downvotes#create'
  delete '/downvotes', to: 'downvotes#destroy'

  get '/comments/:id/children', to: 'comments#children'
  get '/comments/search', to: 'comments#search'

  get '/osers/:id/comments', to: 'osers#comments'
  get '/osers/search', to: 'osers#search'
  get '/signup', to: 'osers#signup'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :comments
  resources :osers
end
