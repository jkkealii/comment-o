Rails.application.routes.draw do
  root to: 'home#index'
  get 'home/osers', to: 'home#osers'
  get 'home/comments', to: 'home#comments'

  resources :comments
  resources :osers
end
