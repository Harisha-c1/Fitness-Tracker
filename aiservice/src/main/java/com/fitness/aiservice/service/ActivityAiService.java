package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAiService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt=createPromptForActivity(activity);
        String aiResponse=geminiService.getAnswer(prompt);
        return processAiResponse(activity,aiResponse);

    }
    private Recommendation processAiResponse(Activity activity,String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            JsonNode textNode=rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");
            String jsonContent=textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();
            JsonNode analysisJson=mapper.readTree(jsonContent);
            JsonNode analysisNode=analysisJson.path("analysis");
            StringBuilder fullAnalysis=new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements=extractImprovments(analysisJson.path("improvements"));
            List<String> suggestions=extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety=extractSafety(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .suggestions(suggestions)
                    .safety(safety)
                    .improvements(improvements)
                    .creationDate(LocalDateTime.now())
                    .build();


        }catch(Exception e){
            log.error(e.getMessage());
            return createDefaultrecommendation(activity);
        }

    }

    private Recommendation createDefaultrecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("unable to Generate Detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a FITNESS professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .creationDate(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safety=new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(item ->{
                safety.add(item.asText());
            });
        }
        return safety.isEmpty() ? Collections.singletonList("Fallow some general Safety Measures"):safety;

    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions=new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion ->{
                String workout=suggestion.path("workout").asText();
                String description=suggestion.path("description").asText();
                suggestions.add(String.format("%s : %s",workout,description));
            });
        }
        return suggestions.isEmpty() ? Collections.singletonList("No specific suggestions provided"):suggestions;
    }

    private List<String> extractImprovments(JsonNode improvementsNode) {
        List<String> improvements=new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement ->{
                String area=improvement.path("area").asText();
                String detail=improvement.path("recommendation").asText();
                improvements.add(String.format("%s : %s",area,detail));
            });
        }
        return improvements.isEmpty() ? Collections.singletonList("No specific improvements provided"):improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                  Analyze this fitness activity and provide detailed recommendation in the following EXACT JSON format:
                  {
                  "analysis":{
                  "overall": "Overall analysis here",
                  "pace": "pace analysis here",
                  "heartRate": "heart rate analysis here",
                  "caloriesBurned": "calories  analysis here"
                  },
                  "improvements": [
                  {
                     "area": "Area name",
                     "recommendation": "Detailed recommendation"
                  }
                  ],
                  "suggestions":[
                  {
                    "workout": "workout name",
                    "description": "Detailed workout description"
                  }
                  ],
                  "safety":[
                    "safety point 1",
                    "safety point 2"
                    ]
                  }
                  Analyse this activity:
                  Activity Type: %s
                  Duration: %d minutes
                  Calories Burned: %d
                  Additional Metrics: %s
                  
                  provide detailed analysis focusing on performance,improvements,next workout suggestions, and safety guidelines.
                  Ensure the response follows the EXACT JSON format shown above.
                  """,
                     activity.getType(),
                     activity.getDuration(),
                     activity.getCaloriesBurned(),
                     activity.getAdditionalMetrics()
        );

    }

}
