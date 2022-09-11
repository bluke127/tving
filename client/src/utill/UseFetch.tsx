import axios from 'axios';
type Methods = 'head' | 'options' | 'put' | 'post' | 'patch' | 'delete' | 'get';
function UseFetch({
  url,
  method = 'get',
  data,
}: {
  url: string;
  method: Methods;
  data: any;
}) {
  //   const [response, setResponse] = useState([]);
  //   const [loading, setLoading] = useRecoilState(loadingState);

  return axios[method](url, data).then((response: any) => response.data);
}
export default UseFetch;
