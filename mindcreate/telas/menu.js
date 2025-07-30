import {TouchableOpacity, StyleSheet} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
 
export default function menu(){
 
  const navigation = useNavigation();
  return(
    <TouchableOpacity style= {styles.botao} onPress={()=>navigation.openDrawer()}>
      <Feather
      name='menu'
      size={20}
      color='darkgreen'/>
    </TouchableOpacity>
  )
}
 
const styles = StyleSheet.create({
  botao: {
   zIndex: 9,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    borderRadius: 100
    },
 
})