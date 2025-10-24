//depois de ter feito toda a requisicao e talz do pokemon
return `
        <a href="./pokemon.html" class="main_List__Card">
          <div class="main_List__Card-Top">
            <p class="main_List__Card-Top--Index">#${  Pokemon.id  }</p>
            <button id="addFav" class="main_List__Card-Top--Icon">
              <img 
                class="main_List__Card-Top--IconImage" 
                src="./assets/icon_star.svg"
              />
            </button>
          </div>


          <figure class="main_List__Image">
            <img class="main_List__Image-Img" src="${  Pokemon.imageURL  }"/>
          </figure>

          <section class="main_List__Section">
            <p>${  Pokemon.Name  }</p>
          </section>
        </a>


`
