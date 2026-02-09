document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      if (!confirm('Remove this item from cart?')) return;
      fetch('/cart/remove', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) })
        .then(r => r.json())
        .then(j => {
          if (j.success) {
            const tr = document.getElementById(`cart-${id}`);
            if (tr) tr.remove();
            // optional: reload to update gross total
            location.reload();
          } else alert('Failed to remove');
        });
    });
  });
});
