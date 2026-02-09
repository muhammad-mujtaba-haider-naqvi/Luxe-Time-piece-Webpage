// admin.js handles AJAX delete for products and images, and set primary image
document.addEventListener('DOMContentLoaded', function() {
  // Delete product buttons on home
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      if (!confirm('Delete this product?')) return;
      fetch(`/admin/product/${id}`, { method: 'DELETE' })
        .then(r => r.json())
        .then(j => {
          if (j.success) {
            const el = document.getElementById(`product-${id}`);
            if (el) {
              el.style.opacity = '0';
              el.style.transform = 'scale(0.9)';
              setTimeout(() => el.remove(), 300);
            }
          } else alert('Failed to delete');
        });
    });
  });

  // Delete individual image on edit page
  document.querySelectorAll('.btn-delete-image').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const fname = this.dataset.fname;
      const id = this.dataset.id;
      if (!confirm('Delete this image?')) return;
      fetch(`/admin/product/${id}/image`, { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ filename: fname }) })
        .then(r => r.json())
        .then(j => {
          if (j.success) {
            const item = this.closest('.sec-item');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => item.remove(), 300);
            // Update primary image display if changed
            if (j.newPrimary) {
              const primaryImg = document.getElementById('current-primary');
              if (primaryImg) primaryImg.src = '/' + j.newPrimary;
            }
          } else alert('Failed to delete image');
        });
    });
  });

  // Set primary image on edit page
  document.querySelectorAll('.btn-set-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const fname = this.dataset.fname;
      const id = this.dataset.id;
      fetch(`/admin/product/${id}/primary`, { 
        method: 'PUT', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ filename: fname }) 
      })
        .then(r => r.json())
        .then(j => {
          if (j.success) {
            // Update the primary image display
            const primaryImg = document.getElementById('current-primary');
            if (primaryImg) {
              primaryImg.style.opacity = '0';
              setTimeout(() => {
                primaryImg.src = '/' + j.primaryImage;
                primaryImg.style.opacity = '1';
              }, 200);
            }
            // Update visual indicator - remove is-primary from all, add to selected
            document.querySelectorAll('.sec-item').forEach(item => {
              item.classList.remove('is-primary');
            });
            this.closest('.sec-item').classList.add('is-primary');
          } else {
            alert('Failed to set primary image');
          }
        });
    });
  });
});
