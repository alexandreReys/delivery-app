const INITIAL_STATE = {
  products: [],
  IdVinho: "",
  DescricaoVinho: "",
  PrecoVinho: "",
  TipoVinho: "",
  ClassificacaoVinho: "",
  PaisVinho: "",
  GarrafaVinho: "",
  ComentarioVinho: "",
  CodigoErpVinho: "",
  Imagem1Vinho: "",
  operacaoVinho: "list",
  selectedCategory: "",
};

export default function vinhoReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_VINHO_GET_PRODUCTS":
      return functionGetProducts(state, action);
    case "ACTION_VINHO_LIST":
      return functionList(state);
    case "ACTION_VINHO_ADD":
      return functionAdd(state);
    case "ACTION_VINHO_EDIT":
      return functionEdit(state, action);
    case "ACTION_VINHO_DELETE":
      return functionDelete();
    case "ACTION_SET_PRODUCT_CATEGORY":
      return functionSetProductCategory(state, action);
    default:
      return state;
  }
}

const functionGetProducts = (state, { products }) => {
  return {
    ...state,
    products: products,
  };
};

const functionSetProductCategory = (state, { category }) => {
  return {
    ...state,
    selectedCategory: category,
  };
};

const functionList = (state) => ({
  ...state,
  IdVinho: "",
  DescricaoVinho: "",
  PrecoVinho: "",
  TipoVinho: "",
  ClassificacaoVinho: "",
  PaisVinho: "",
  GarrafaVinho: "",
  ComentarioVinho: "",
  CodigoErpVinho: "",
  Imagem1Vinho: "",
  operacaoVinho: "list",
});

const functionAdd = (state) => ({
  ...state,
  IdVinho: "",
  DescricaoVinho: "",
  PrecoVinho: 0,
  TipoVinho: "",
  ClassificacaoVinho: "",
  PaisVinho: "",
  GarrafaVinho: "",
  ComentarioVinho: "",
  CodigoErpVinho: "",
  Imagem1Vinho: "",
  operacaoVinho: "add",
});

const functionEdit = (state, { dadosVinho }) => {
  return {
    ...state,
    IdVinho: dadosVinho.IdVinho,
    DescricaoVinho: dadosVinho.DescricaoVinho,
    PrecoVinho: dadosVinho.PrecoVinho,
    TipoVinho: dadosVinho.TipoVinho,
    ClassificacaoVinho: dadosVinho.ClassificacaoVinho,
    PaisVinho: dadosVinho.PaisVinho,
    GarrafaVinho: dadosVinho.GarrafaVinho,
    ComentarioVinho: dadosVinho.ComentarioVinho,
    CodigoErpVinho: dadosVinho.CodigoErpVinho,
    Imagem1Vinho: dadosVinho.Imagem1Vinho,
    operacaoVinho: "edit",
  };
};

const functionDelete = (state) => ({ ...state, operacaoVinho: "delete" });
