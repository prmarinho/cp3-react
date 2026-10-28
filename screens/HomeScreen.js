import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarSeries() {
      try {
        const resposta = await fetch('https://api.tvmaze.com/shows');

        if (!resposta.ok) {
          throw new Error('Erro na requisição: ' + resposta.status);
        }

        const dados = await resposta.json();
        setSeries(dados);
      } catch (error) {
        console.log(error);
        setErro('Não foi possível carregar as séries. Verifique sua conexão.');
      } finally {
        setCarregando(false);
      }
    }

    buscarSeries();
  }, []);

  function renderSerie({ item }) {
    // algumas séries podem vir com image = null, por isso a verificação
    const imagem = item.image ? item.image.medium : null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Detalhes', { id: item.id, nome: item.name })
        }
      >
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagem} />
        ) : (
          <View style={[styles.imagem, styles.semImagem]}>
            <Text style={styles.semImagemTexto}>Sem imagem</Text>
          </View>
        )}
        <Text style={styles.nome}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#3d5afe" />
        <Text style={styles.mensagem}>Carregando séries...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={series}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderSerie}
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensagem: {
    marginTop: 10,
    fontSize: 16,
  },
  erro: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  lista: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  imagem: {
    width: 70,
    height: 100,
    borderRadius: 4,
  },
  semImagem: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semImagemTexto: {
    fontSize: 10,
    color: '#555',
  },
  nome: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
