import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <View style={styles.container}>
        <View style={{alignItems:'center'}}>
            <Typo color={colors.white} size={43}
            fontWeight={'900'}>SyncUp</Typo>
        </View>

        <Animated.Image
        entering={FadeIn.duration(700).springify()}
        source = {require('@/assets/images/welcome.png')}
        style={styles.welcomeImage}
        resizeMode={'contain'}
        />
        <View>
            <Typo color={colors.white} size={20} fontWeight={'700'}>Stay Connected</Typo>

             <Typo color={colors.white} size={20} fontWeight={'700'}>with your friends</Typo>

              <Typo color={colors.white} size={20} fontWeight={'700'}>and family</Typo>
        </View>

        <Button onPress={()=>router.push('/(auth)/register')}>
            <Typo size={23} fontWeight={'bold'} color="white" >
                Get Started
            </Typo>
        </Button>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={{ alignItems: 'center', marginTop: spacingY._15 }}>
            <Typo size={15} color={colors.neutral400}>
                Already have an account?{' '}
                <Typo size={15} color={colors.primaryLight} fontWeight={'600'}>Sign In</Typo>
            </Typo>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-around',
        paddingHorizontal: spacingX._20,
        marginVertical: spacingY._10,
    },
    background:{
        flex:1,
        backgroundColor: colors.neutral900,
    },
    welcomeImage:{
        height:verticalScale(300),
        aspectRatio:1,
        alignSelf:"center",
    },
})