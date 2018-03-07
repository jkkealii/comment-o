Rails.application.routes.draw do
  root to: 'home#index'
  get '/osers_page', to: 'home#osers_page'
  get '/comments_page', to: 'home#comments_page'
  get '/comments/:id/children', to: 'comments#children'

  resources :comments
  resources :osers
end
