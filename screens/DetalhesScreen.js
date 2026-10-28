import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function DetalhesScreen({ route }) {
  // id e nome da série enviados pela tela inicial
  const { id, nome } = route.params;

  const [episodios, setEpisodios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarEpisodios() {
      try {
        const resposta = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);

        if (!resposta.ok) {
          throw new Error('Erro na requisição: ' + resposta.status);
        }

        const dados = await resposta.json();
        setEpisodios(dados);
      } catch (error) {
        console.log(error);
        setErro('Não foi possível carregar os episódios. Verifique sua conexão.');
      } finally {
        setCarregando(false);
      }
    }

    buscarEpisodios();
  }, [id]);

  function renderEpisodio({ item }) {
    // episódios especiais podem vir com number = null
    const numero = item.number ? item.number : '-';

    return (
      <View style={styles.episodio}>
        <Text style={styles.info}>
          Temporada {item.season} | Episódio {numero}
        </Text>
        <Text style={styles.nomeEpisodio}>{item.name}</Text>
      </View>
    );
  }

  // decide o que mostrar abaixo do nome da série
  function renderConteudo() {
    if (carregando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#3d5afe" />
          <Text style={styles.mensagem}>Carregando episódios...</Text>
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
        data={episodios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEpisodio}
        ListEmptyComponent={
          <Text style={styles.mensagem}>Nenhum episódio encontrado.</Text>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nome}</Text>
      {renderConteudo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mensagem: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  erro: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  episodio: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  info: {
    fontSize: 14,
    color: '#3d5afe',
    fontWeight: 'bold',
  },
  nomeEpisodio: {
    fontSize: 16,
    marginTop: 4,
  },
});
