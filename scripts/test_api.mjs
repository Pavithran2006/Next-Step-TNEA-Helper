#!/usr/bin/env node
import 'dotenv/config'

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...')
    
    // Test both endpoint
    console.log('\n1️⃣ Testing "both" endpoint...')
    const response = await fetch('http://localhost:3000/api/institutions?include=both')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('✅ API Response received')
    console.log(`📊 Data summary:`)
    console.log(`- Success: ${data.ok}`)
    console.log(`- Total institutions: ${data.data?.length || 0}`)
    
    // Count institutions with cutoffs
    const institutionsWithCutoffs = data.data?.filter(inst => 
      inst.cutoffs && inst.cutoffs.length > 0
    ) || []
    
    console.log(`- Institutions with cutoffs: ${institutionsWithCutoffs.length}`)
    
    // Count total cutoff entries
    const totalCutoffs = data.data?.reduce((sum, inst) => 
      sum + (inst.cutoffs?.length || 0), 0
    ) || 0
    
    console.log(`- Total cutoff entries: ${totalCutoffs}`)
    
    // Show sample data
    if (institutionsWithCutoffs.length > 0) {
      console.log('\n📋 Sample institutions with cutoffs:')
      institutionsWithCutoffs.slice(0, 3).forEach(inst => {
        console.log(`- ${inst.name}: ${inst.cutoffs.length} cutoffs`)
        if (inst.cutoffs.length > 0) {
          const sample = inst.cutoffs[0]
          console.log(`  Sample: ${sample.course} - ${sample.category}: ${sample.cutoff || 'N/A'} (${sample.year})`)
        }
      })
    }
    
    console.log('\n✅ "Both" endpoint test completed successfully!')
    
    // Test cutoffs-only endpoint
    console.log('\n2️⃣ Testing "cutoffs" endpoint...')
    const cutoffsResponse = await fetch('http://localhost:3000/api/institutions?include=cutoffs')
    
    if (!cutoffsResponse.ok) {
      throw new Error(`HTTP error! status: ${cutoffsResponse.status}`)
    }
    
    const cutoffsData = await cutoffsResponse.json()
    
    console.log('✅ Cutoffs endpoint response received')
    console.log(`📊 Cutoffs data summary:`)
    console.log(`- Success: ${cutoffsData.ok}`)
    console.log(`- Total cutoff entries: ${cutoffsData.data?.length || 0}`)
    
    if (cutoffsData.data && cutoffsData.data.length > 0) {
      console.log('\n📋 Sample cutoff entries:')
      cutoffsData.data.slice(0, 3).forEach(cutoff => {
        console.log(`- ${cutoff.course} - ${cutoff.category}: ${cutoff.cutoff || 'N/A'} (${cutoff.year}) - College ID: ${cutoff.collegeId}`)
      })
    }
    
    console.log('\n✅ All API tests completed successfully!')
    console.log('The cutoff data should now be visible in the frontend.')
    
  } catch (error) {
    console.error('❌ API test failed:', error.message)
  }
}

testAPI()
