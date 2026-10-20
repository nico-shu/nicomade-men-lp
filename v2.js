// v2: 追従ボタンは、ヒーローと最後の相談欄が見えている間は隠す
(function(){var b=document.querySelector('.sticky-line');if(!b||!('IntersectionObserver'in window))return;
var seen=new Set();var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?seen.add(e.target):seen.delete(e.target)});b.classList.toggle('is-hidden',seen.size>0)});
['.hero','#consult'].forEach(function(q){var el=document.querySelector(q);if(el)io.observe(el)})})();
