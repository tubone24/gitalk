import React from 'react'

const ph = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'

export default ({ src, className, alt, defaultSrc = '//cdn.jsdelivr.net/npm/gitalk@1/src/assets/icon/github.svg' }) => (
  <div className={`gt-avatar ${className}`}>
    <img className="lozad" src={ph} data-src={src || defaultSrc} alt={`@${alt}`} onError={function (e) {
      e.target.src = defaultSrc
    }} />
  </div>
)
