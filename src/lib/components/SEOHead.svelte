<script>
  export let title = "Polished Perfection - Professional Nail Artistry & Beauty Services";
  export let description = "Transform your nails with our professional nail artistry services. Specializing in gel nails, nail art, manicures, pedicures, and custom designs. Book your appointment today!";
  export let image = "/social-image.svg";
  export let url = "https://polishedperfection.com/";
  export let type = "website";
  export let keywords = "nail art, gel nails, manicure, pedicure, nail salon, nail design, professional nails, nail technician, beauty services";
  
  // Ensure title doesn't exceed recommended length
  $: truncatedTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
  
  // Ensure description doesn't exceed recommended length
  $: truncatedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{truncatedTitle}</title>
  <meta name="title" content={truncatedTitle} />
  <meta name="description" content={truncatedDescription} />
  <meta name="keywords" content={keywords} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={truncatedTitle} />
  <meta property="og:description" content={truncatedDescription} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Polished Perfection - Professional Nail Salon" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={url} />
  <meta property="twitter:title" content={truncatedTitle} />
  <meta property="twitter:description" content={truncatedDescription} />
  <meta property="twitter:image" content={image} />
  <meta property="twitter:image:alt" content="Polished Perfection - Professional Nail Salon" />
  
  <!-- Additional Meta Tags -->
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Polished Perfection" />
  <link rel="canonical" href={url} />
</svelte:head>