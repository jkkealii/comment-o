Rails.application.routes.draw do
  root to: 'home#index'
  get '/osers_page', to: 'home#osers_page'
  get '/comments_page', to: 'home#comments_page'

  resources :comments
  resources :osers
end
