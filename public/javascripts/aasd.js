
 <!-- <nav class="navbar navbar-expand-sm bg-dark navbar-dark">    
 <div class="container">        
    <a class="navbar-brand" href="/" ><%= title %></a>
     <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse">
      <span class="navbar-toggler-icon"></span>
     </button>	      

     <div class="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarSupportedContent">
         <ul class="navbar-nav ml-auto" >									
                 <li   style="font-size:24px;" <%if(active=="Mens"){%>class="active"<%}%> >
                       <a class="nav-link" href="/category/Mens">Mens</a>
                 </li>
                 <li  style="font-size:24px; " <%if(active=="Womens"){%>class="active"<%}%>>
                       <a class="nav-link" href="/category/Womens">Womens</a>
                 </li>													
         </ul>
        </div>                           		
</nav> 
<div class="container">
 <div class="row">
 <nav aria-label="breadcrumb">
         <ol class="breadcrumb" style="background: transparent;">
           <li class="breadcrumb-item"><a href="#">Home</a></li>   
           <li class="breadcrumb-item"><a href="#"><%= active %></a></li>                          
           <li class="breadcrumb-item active" aria-current="page"><%= subcat %></li>
         </ol>
       </nav>
     </div>
</div> -->



<!-- <div class="container">
 <% _.each(items, function(topC) { %>
     <div class="card mb-5" style="padding:15px;">
 <div class="row mt-3">
         <div class="col-9 ">
                 <h3 class="title" style="color:red"><%= topC.name %></h3>
         </div>               
         <% if (fs.existsSync('/images/categories/<%= topC.primary_category_id %>.jpg')) { %>           
         <div class="col-9">
                 <img src="/images/categories/<%= topC.primary_category_id %>.jpg">
         </div>
         <% } %> 
         <% if (fs.existsSync('/images/categories/<%= topC.primary_category_id %>.png')) { %>           
             <div class="col-9">
                     <img src="/images/categories/<%= topC.primary_category_id %>.png">
             </div>
             <% } %>     
         <div class="col-9 mt-2 mb-5">
                 <p><%= topC.page_description %></p>
         </div>
         
 </div>
 <% _.each(topC.categories, function(subC) { %>
 <div class="row">                           
         <div class="col-9">
                 <h3 class="title"><%= subC.name %></h3>
         </div>
         
         <div class="col-9 mt-3">
                 <p><%= subC.page_description %></p>
         </div>
         <div class="w-100"></div>
         <div class="col-3">
                 <a href="" class="btn btn-outline-dark">View products</a>
         </div>        
                     
 </div>
 <hr /> 
 <% }); %>
</div>
 <% }); %>
</div>       -->