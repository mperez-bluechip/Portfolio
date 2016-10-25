$ = require 'jquery'

do fill = (item = 'Add login here') ->
  $('.tagline').append "#{item}"
fill
