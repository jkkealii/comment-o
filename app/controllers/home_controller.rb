class HomeController < ApplicationController
  def index
    @comments = grab_comments(5)
    @osers = []
    Oser.order(created_at: :desc).pluck(:username, :id, :flair, :created_at).each do |username, id, flair, created_at|
      @osers << {
        username: username,
        id: id,
        flair: flair,
        joined: created_at.to_formatted_s(:long)
      }
    end
  end

  def osers

  end

  def comments
    @comments = grab_comments
  end

  private

  def grab_comments(limit = nil)
    if limit.nil?
      comment_records = Comment.order(created_at: :desc).includes(:oser)
    else
      comment_records = Comment.order(created_at: :desc).limit(limit.to_i).includes(:oser)
    end
    comments = []
    comment_records.each do |comment|
      comments << {
        id: comment.id,
        content: comment.content,
        ups: comment.ups,
        downs: comment.downs,
        edited: comment.edited,
        posted: comment.created_at.to_formatted_s(:long),
        updated: comment.updated_at.to_formatted_s(:long),
        oser: {
          id: comment.oser.id,
          username: comment.oser.username,
          flair: comment.oser.flair
        }
      }
    end
    comments
  end
end
