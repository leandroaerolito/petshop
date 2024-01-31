import Head from "next/head";
import styled from "styled-components";
import ListaPosts from "@/components/ListaPosts";
import { useState } from "react";
import serverApi from "./api/server";
import ListaCategorias from "@/components/ListaCategorias";

export async function getStaticProps() {
  try {
    const resposta = await fetch(`${serverApi}/posts.json`);
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(`Erro: ${resposta.status} - ${resposta.statusText}`);
    }

    /* Colocando os dados dos objetos dentro de um array */
    const arrayDePosts = Object.keys(dados).map((post) => {
      return {
        ...dados[post],
        id: post,
      };
    });

    /* 
    1) Object.keys(dados): extrair as chaves/id de cada objeto para um array.

    2) Map no array de chaves, em que retornamos um novo objeto.

    3) Cada novo objeto (representado por post) é criado com os dados existentes

    4) No caso do id, atribuimos a própria chave de cada objeto. Portanto, ao invés de ids numéricos, os ids passam a ser na aplicação o próprio hash/código de cada post.
    */

    console.log(arrayDePosts);

    const categorias = arrayDePosts.map((post) => post.categoria);
    const categoriasUnicas = [...new Set(categorias)];

    return {
      props: {
        posts: arrayDePosts,
        categorias: categoriasUnicas,
      },
    };
  } catch (error) {
    console.error("Deu ruim: " + error.message);
    return {
      notFound: true,
    };
  }
}

export default function Home({ posts, categorias }) {
  const [listaDePosts, setListaDePosts] = useState(posts);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState("");

  const filtrar = (event) => {
    const categoriaEscolhida = event.currentTarget.textContent;

    const novaListaDePosts = posts.filter(
      (post) => post.categoria === categoriaEscolhida
    );

    // Sinalizando o state como filtro ativo (true)
    setFiltroAtivo(true);
    setListaDePosts(novaListaDePosts);

    // Sinalizando o state com o texto/categoria escolhida
    setCategoriaAtiva(categoriaEscolhida);
  };

  const limparFiltro = () => {
    // Sinalizando o state como filtro inativo (false)
    setFiltroAtivo(false);

    // Atualizando o state da listaDePosts para os posts originais
    setListaDePosts(posts);

    // Atualizando o state da categoria ativa para vazio""
    setCategoriaAtiva("");
  };

  return (
    <>
      <Head>
        <title>PetShop</title>
        <meta
          name="description"
          content="Web App PetShop criado com Next.js como exemplo do curso Téc. Informática para Internet"
        />
        <meta name="keywords" content="PetShop, Banho, Ração, Gato, Cachorro" />
      </Head>
      <StyledHome>
        <h2>Pet Notícias</h2>

        <ListaCategorias
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          onFiltrar={filtrar}
          filtroAtivo={filtroAtivo}
          onLimparFiltro={limparFiltro}
        />

        <ListaPosts posts={listaDePosts} />
      </StyledHome>
    </>
  );
}

const StyledHome = styled.section`
  h2::before {
    content: "📰 ";
  }
`;
