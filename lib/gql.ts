import { gql } from "@apollo/client";

const BASE_MEDIA_DATA = `
type
id
title {
  romaji
}
`;

const BASE_CHARA_DATA = `
id
`;

export const MEDIA_DATA_QUERY = gql`
  query ($id: Int, $chara_page: Int) {
    Media(id: $id) {
      ${BASE_MEDIA_DATA}
      siteUrl
      characters(page: $chara_page) {
        pageInfo {
          currentPage
          hasNextPage
        }
        nodes {
          ${BASE_CHARA_DATA}
        }
      }
    }
  }
`;

const NAME = `
name {
  userPreferred
  native
}
`;

export const CHARA_DATA_QUERY = gql`
query ($id: Int) {
  Character(id: $id) {
    ${BASE_CHARA_DATA}
    ${NAME}
    image {
      large
    }
    description(asHtml: true)
    gender
    dateOfBirth {
      year
      month
      day
    }
    age
    siteUrl
    favourites
    media(sort: POPULARITY_DESC) {
      edges {
        node {
          ${BASE_MEDIA_DATA}
        }
        voiceActors(language: JAPANESE, sort: FAVOURITES_DESC) {
          ${NAME}
        }
        characterRole
      }
    }
  }
}
`;
